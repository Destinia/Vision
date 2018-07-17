import time
import json
from argparse import ArgumentParser

try:
    import firebase_admin
    from firebase_admin import credentials
    from firebase_admin import firestore
except ImportError:
    print('Install firebase sdk')
    exit(1)


def get_firestore(cert_path, config_path):
    with open(config_path) as f:
        config = json.load(f)

    # Fetch the service account key JSON file contents
    cred = credentials.Certificate(cert_path)

    # Initialize the app with a service account, granting admin privileges
    app = firebase_admin.initialize_app(cred, {
        'databaseURL': config['databaseURL']
    })

    return firestore.client(app)


def _update_document(document, value):
    document.update({'values': value})


def reset(args, store=None):
    if not store:
        store = get_firestore(args.cert, args.config)
    collection = store.collection(args.collection)
    query = collection.where('name', '==', args.name)

    for document in query.get():
        _update_document(document.reference, [])
        print('Sequence "{}" has been reset'.format(args.name))


def extend(args, store=None):
    if not store:
        store = get_firestore(args.cert, args.config)
    collection = store.collection(args.collection)
    values = [snapshot.reference.get().to_dict()['value']
              for snapshot in collection.where('name', '==', args.name).get()]

    documents = [snapshot.reference
                 for snapshot in collection.where('name', '==', args.name).get()]

    print('Updating sequence "{}"'.format(args.name))
    while True:
        for doc, value in zip(documents, values):
            # TODO: Support different sequence function
            value.append(dict(timestamp=int(time.time()), value=1))
            _update_document(doc, value)

        time.sleep(args.period)


def generate(args):
    store = get_firestore(args.cert, args.config)
    reset(args, store=store)
    extend(args, store=store)


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('--cert', default='../firebase-admin.json')
    parser.add_argument('--config', default='../firebase-config.json')
    subparsers = parser.add_subparsers()

    parser_reset = subparsers.add_parser('reset')
    parser_reset.add_argument('collection')
    parser_reset.add_argument('name')
    parser_reset.set_defaults(func=reset)

    parser_generate = subparsers.add_parser('generate')
    parser_generate.add_argument('collection')
    parser_generate.add_argument('name')
    parser_generate.add_argument('period', default=1, type=float)
    parser_generate.set_defaults(func=generate)

    parser_extend = subparsers.add_parser('extend')
    parser_extend.add_argument('collection')
    parser_extend.add_argument('name')
    parser_extend.add_argument('period', default=1, type=float)
    parser_extend.set_defaults(func=extend)

    args = parser.parse_args()
    args.func(args)
