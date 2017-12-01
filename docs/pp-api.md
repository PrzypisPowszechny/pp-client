
# Responses

To moja propozycja schematu kodów błędu:

##### sukces

- **wszystkie udane zapytania (niezależnie od metody HTTP) mają kod `200` -  zawierają `data`** (które może być nullem)
```json
{
    "data": {
      ...
    }
}
```

##### błędy

Proponuję założyć (zgodnie z JSON API), że 

- **wszystkie nieudane zapytania zawierają `errors` w korzeniu.**

```json
{
    "errors": {
      [
        { 
          ... 
        },
        { 
          ... 
        },
        ...
      ]

    }
}
```

Mogą mieć dowolny kod błędu a każdy błąd wewnątrz `errors` może mieć różne wewnętrzne atrybuty 
(zgodne z JSON API, jest ich kilkanaście)

###### błędy krytyczne vs błędy walidacji

Dodatkowo, 
- **wszystkie zapytania nieudane z powodu błędów walidacji formularza, które aplikacja mogłaby chcieć przeanalizować
 i wyświetlić mają kod `400` i zwracają taką odpowiedź jak poniżej** (zgodną z JSON-API). Ta odpowiedź wraca do widoku, w którym 
 wysłano zapytanie i błędy walidacji można wyświetlić w interfejsie w formularzu.
 
 Wszystkie pozostałe błędy są krytyczne i kończą się crashem aplikacji w stylu
 "Wystąpił nieoczekiwany błąd" i mogą być obsługiwane przez jakiś globalny handler 
 (który np. wyświetla w jakimś panelu informację, że cała wtyczka się zepsuła).

```json
{
    "errors": [
        {
            "source": {
                "field": "comment"
            },
            "detail": "Za długi komentarz"
        },
        ...
    ]
}
```


# references
#### GET /api/references/{id}/

##### response
```json
{
    "data": {
        "id": "45",
        "type": "references",
        "attributes": {
            "url": "www.przypis.com",
            "ranges": "{json}",
            "quote": "very nice",
            "create_date": "2017-11-27T13:18:53.452289Z",
            "priority": "NORMAL",
            "comment": "nice website",
            "reference_link": "www.przypispowszechny.com",
            "reference_link_title": "przypis website",
            "useful": false,
            "useful_count": 0,
            "objection": false,
            "objection_count": 0,
            "does_belong_to_user": true
        },
        "relationships": {
            "user": {
                "data": {
                    "type": "users",
                    "id": "2"
                }
            },
            "reference_request": {
                "data": {
                    "type": "reference_requests",
                    "id": "1"
                }
            }
        }
    }
}
```

W przypadku braku `reference_request`:
```json
            ...
            "reference_request": {
                "data": null
            }

```

#### GET /api/references/search/

#####parameters

- `page[limit]` int
- `page[offset]` int
- `sort` int (e.g `-create_data`)
- `url` string

##### response
```json
{
    "data": 
        [
            {
                "id": "45",
                "type": "references",
                "attributes": {
                    "url": "www.przypis.com",
                    "ranges": "{json}",
                    "quote": "very nice",
                    "create_date": "2017-11-27T13:18:53.452289Z",
                    "priority": "NORMAL",
                    "comment": "nice website",
                    "reference_link": "www.przypispowszechny.com",
                    "reference_link_title": "przypis website",
                    "useful": false,
                    "useful_count": 0,
                    "objection": false,
                    "objection_count": 0,
                    "does_belong_to_user": true
                },
                "relationships": {
                    "user": {
                        "data": {
                            "type": "users",
                            "id": "2"
                        }
                    },
                    "reference_request": {
                        "data": {
                            "type": "reference_requests",
                            "id": "1"
                        }
                    }
                }
            },
            
            ...
        ]
    }
}
```

#### PATCH /api/references/{id}/

####body

dowolny podzbiór atrybutów:
`'priority', 'comment', 'reference_link', 'reference_link_title'`

Zapytanie z określonymi wszystkimi:
```json
{
    "data": {
        "id": "1",
        "type": "references",
        "attributes": {
            "priority": "NORMAL",
            "comment": "fajna strona",
            "reference_link": "www.przypispowszechny.com",
            "reference_link_title": "strona przypisu powszechnego"
        }
    }        
}
```
##### response

(taka sama jak odpowiedź GET)
```json
{
    "data": {
        "type": "references",
        "id": "45",
        "attributes": {
            "url": "www.przypis.com",
            "ranges": "{json}",
            "quote": "very nice",
            "create_date": "2017-11-27T13:18:53.452289Z",
            "priority": "NORMAL",
            "comment": "nice website",
            "reference_link": "www.przypispowszechny.com",
            "reference_link_title": "przypis website",
            "useful": false,
            "useful_count": 0,
            "objection": false,
            "objection_count": 0,
            "does_belong_to_user": true
        },
        "relationships": {
            "user": {
                "data": {
                    "type": "users",
                    "id": "2"
                }
            },
            "reference_request": {
                "data": {
                    "type": "reference_requests",
                    "id": "1"
                }
            }
        }
    }
}
```

#### POST /api/references/

#####body
```json
{
	"data": {
        "type": "references",
        "attributes": {
            "url": "www.przypis.com",
            "ranges": "{json}",
            "quote": "very nice",
            "priority": "NORMAL",
            "comment": "nice website",
            "reference_link": "www.przypispowszechny.com",
            "reference_link_title": "przypis website"
        },
        "relationships": {
            "reference_request": {
              "data": {"id": "1"}
            }
        }
	}
}
```


reference_request nullowalny (a więc i relationships)
W przypadku braku `reference_request`:
```json
            ...
            "reference_request": {
                "data": null
            }

```

##### response

(taka sama jak odpowiedź GET)
```json
{
    "data": {
        "type": "references",
        "id": "45",
        "attributes": {
            "url": "www.przypis.com",
            "ranges": "{json}",
            "quote": "very nice",
            "create_date": "2017-11-27T13:18:53.452289Z",
            "priority": "NORMAL",
            "comment": "nice website",
            "reference_link": "www.przypispowszechny.com",
            "reference_link_title": "przypis website",
            "useful": false,
            "useful_count": 0,
            "objection": false,
            "objection_count": 0,
            "does_belong_to_user": true
        },
        "relationships": {
            "user": {
                "data": {
                    "type": "users",
                    "id": "2"
                }
            },
            "reference_request": {
                "data": {
                    "type": "reference_requests",
                    "id": "1"
                }
            }
        }
    }
}
```

#### DELETE /api/references/{id}/

##### response

(taka sama jak odpowiedź GET)
```json
{
    "data": {
        "type": "references",
        "id": "45",
        "attributes": {
            "url": "www.przypis.com",
            "ranges": "{json}",
            "quote": "very nice",
            "create_date": "2017-11-27T13:18:53.452289Z",
            "priority": "NORMAL",
            "comment": "nice website",
            "reference_link": "www.przypispowszechny.com",
            "reference_link_title": "przypis website",
            "useful": false,
            "useful_count": 0,
            "objection": false,
            "objection_count": 0,
            "does_belong_to_user": true
        },
        "relationships": {
            "user": {
                "data": {
                    "type": "users",
                    "id": "2"
                }
            },
            "reference_request": {
                "data": {
                    "type": "reference_requests",
                    "id": "1"
                }
            }
        }
    }
}
```
# reference_reports

#### POST /api/references/{reference_id}/reports/

##### body

```json
{
    'data': {
        'type': 'reference_reports',
        'attributes': {
            'reason': 'SPAM',
            'comment': 'komentarz'
        }
    }
}
```

##### response
```json
{
    "data": {
        "type": "reference_reports",
        "id": "6",
        "attributes": {
            "reason": "SPAM",
            "comment": "koment"
        },
        "relationships": {
            "user": {
                "data": {
                    "type": "users",
                    "id": "2"
                }
            },
            "reference": {
                "data": {
                    "type": "references",
                    "id": "1"
                }
            }
        }
    }
}
```


# reference_usefuls + reference_objections

#### POST /api/references/{reference_id}/usefuls/
#### DELETE /api/references/{reference_id}/usefuls/
#### POST /api/references/{reference_id}/objections/
#### DELETE /api/references/{reference_id}/objections/

Brak response body i brak data w response jest niezgodne z JSON API, ale wydaje mi się, że tak będzie lepiej.
To zapytanie, które dodaje obiekt bez żadnych atrybutów.
Facebook API robi analogicznie z like'ami (zwraca samo `{ success: true }`)

###### response
```json
{
    "data": null
}

```


# Część 2
Ta część przyda się w kolejnej wersji (ale bardzo niedalekiej - okołoświątecznej). 

Wrzucam z dwóch powodów:
1) żeby było wiadomo, że to też zaraz wejdzie,
2) `reference_requests` jest analogiczne do samego `references`, 
więc moglibyśmy to od razu zrobić.

# reference_requests

#### GET /api/reference_requests/{id}/


##### response
```json
{
    "data": {
        "id": "45",
        "type": "reference_requests",
        "attributes": {
            "url": "www.przypis.com",
            "ranges": "{json}",
            "quote": "very nice",
            "create_date": "2017-11-27T13:18:53.452289Z",
            "comment": "nice website",
            "support": false,
            "support_count": 0,
            "does_belong_to_user": true
        },
        "relationships": {
            "user": {
                "data": {
                    "type": "users",
                    "id": "2"
                }
            }
        }
    }
}
```



#### GET /api/reference_requests/search/

##### parameters

- `page[limit]` int
- `page[offset]` int
- `sort` int (e.g `-create_data`)
- `url` string

##### response
```json
{
    "data": [
        {
            "id": "45",
            "type": "reference_requests",
            "attributes": {
                "url": "www.przypis.com",
                "ranges": "{json}",
                "quote": "very nice",
                "create_date": "2017-11-27T13:18:53.452289Z",
                "comment": "nice website",
                "support": false,
                "support_count": 0,
                "does_belong_to_user": true
            },
            "relationships": {
                "user": {
                    "data": {
                        "type": "users",
                        "id": "2"
                    }
                }
            }
        },
        
        ...
    
    ]
}
```

#### POST /api/reference_requests/


#####body
```json
{
    "data": {
        "type": "reference_requests",
        "attributes": {
            "url": "www.przypis.com",
            "ranges": "{json}",
            "quote": "very nice",
            "comment": "nice website",
        }
    }
}
```

##### response
```json
{
    "data": {
        "type": "reference_requests",
        "id": "45",
        "attributes": {
            "url": "www.przypis.com",
            "ranges": "{json}",
            "quote": "very nice",
            "create_date": "2017-11-27T13:18:53.452289Z",
            "comment": "nice website",
            "support": false,
            "support_count": 0,
            "does_belong_to_user": true
        },
        "relationships": {
            "user": {
                "data": {
                    "type": "users",
                    "id": "2"
                }
            }
        }
    }
}
```


#### PATCH /api/reference_requests/{id}/

dowolny podzbiór atrybutów: (na razie tylko jeden)

`comment`

```json
{
    "data": {
        "id": "1"
        "type": "reference_requests",
        "attributes": {
            "comment": "nice website"
        }
    }        
}
```

##### response
```json
{
    "data": {
        "type": "reference_requests",
        "id": "45",
        "attributes": {
            "url": "www.przypis.com",
            "ranges": "{json}",
            "quote": "very nice",
            "create_date": "2017-11-27T13:18:53.452289Z",
            "comment": "nice website",
            "support": false,
            "support_count": 0,
            "does_belong_to_user": true
        },
        "relationships": {
            "user": {
                "data": {
                    "type": "users",
                    "id": "2"
                }
            }
        }
    }
}
```



#### DELETE /api/reference_requests/{id}/

##### response
```json
{
    "data": {
        "type": "reference_requests",
        "id": "45",
        "attributes": {
            "url": "www.przypis.com",
            "ranges": "{json}",
            "quote": "very nice",
            "create_date": "2017-11-27T13:18:53.452289Z",
            "comment": "nice website",
            "support": false,
            "support_count": 0,
            "does_belong_to_user": true
        },
        "relationships": {
            "user": {
                "data": {
                    "type": "users",
                    "id": "2"
                }
            }
        }
    }
}
```

