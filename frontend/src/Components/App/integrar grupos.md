para receber um array de grupos:

1) passe o user por props numa Route do App
2) import {groups} from CAMINHO ATE API /api.js
3) groups.getAll()


Essa é a cara do array de grupos que será recebido:
[
    {
        "members": [
            "Batman",
            "Superman",
            "Aquaman"
        ],
        "expenses": [
            {
                "split": {
                    "dividedBy": [
                        "Batman",
                        "Aquaman",
                        "Superman"
                    ],
                    "isDividedByAll": false,
                    "paidBy": "Batman"
                },
                "_id": "5e3989cf04e3c0490e0d6ae5",
                "owner": "5e39871b04e3c0490e0d6ae4",
                "description": "carvão",
                "value": 9,
                "__v": 0
            },
            {
                "split": {
                    "dividedBy": [
                        "Batman",
                        "Aquaman",
                        "Superman"
                    ],
                    "isDividedByAll": false,
                    "paidBy": "Batman"
                },
                "_id": "5e3989f504e3c0490e0d6ae6",
                "owner": "5e39871b04e3c0490e0d6ae4",
                "description": "picanha",
                "value": 9,
                "__v": 0
            },
            {
                "split": {
                    "dividedBy": [
                        "Batman",
                        "Aquaman",
                        "Superman"
                    ],
                    "isDividedByAll": false,
                    "paidBy": "Batman"
                },
                "_id": "5e398a0204e3c0490e0d6ae7",
                "owner": "5e39871b04e3c0490e0d6ae4",
                "description": "pão de alho",
                "value": 9,
                "__v": 0
            },
            {
                "split": {
                    "dividedBy": [
                        "Batman",
                        "Aquaman",
                        "Superman"
                    ],
                    "isDividedByAll": false,
                    "paidBy": "Aquaman"
                },
                "_id": "5e398a2504e3c0490e0d6ae8",
                "owner": "5e39871b04e3c0490e0d6ae4",
                "description": "guardanapo",
                "value": 2,
                "__v": 0
            },
            {
                "split": {
                    "dividedBy": [
                        "Batman",
                        "Aquaman",
                        "Superman"
                    ],
                    "isDividedByAll": false,
                    "paidBy": "Superman"
                },
                "_id": "5e398a3a04e3c0490e0d6ae9",
                "owner": "5e39871b04e3c0490e0d6ae4",
                "description": "queijo coalho",
                "value": 1,
                "__v": 0
            }
        ],
        "settles": [
            {
                "_id": "5e398a8a04e3c0490e0d6aea",
                "owner": "5e39871b04e3c0490e0d6ae4",
                "paidBy": "Superman",
                "paidTo": "Batman",
                "value": 8,
                "__v": 0
            },
            {
                "_id": "5e398aa204e3c0490e0d6aeb",
                "owner": "5e39871b04e3c0490e0d6ae4",
                "paidBy": "Aquaman",
                "paidTo": "Batman",
                "value": 5,
                "__v": 0
            },
            {
                "_id": "5e398aa504e3c0490e0d6aec",
                "owner": "5e39871b04e3c0490e0d6ae4",
                "paidBy": "Aquaman",
                "paidTo": "Batman",
                "value": 2,
                "__v": 0
            }
        ],
        "_id": "5e39871b04e3c0490e0d6ae4",
        "owner": "5e3986d504e3c0490e0d6ae3",
        "groupName": "churras herois",
        "description": "teste balance",
        "date": "2020-02-04T00:00:00.000Z",
        "__v": 0
    },
    {
        "members": [],
        "expenses": [],
        "settles": [],
        "_id": "5e3c0340f409e451efc04b93",
        "owner": "5e3986d504e3c0490e0d6ae3",
        "groupName": "grupo 02",
        "description": "lala",
        "date": "2020-02-01T00:00:00.000Z",
        "__v": 0
    }
]