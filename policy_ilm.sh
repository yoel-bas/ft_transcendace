#!/bin/bash

until curl -u "elastic:${ELASTIC_PASSWORD}" -s --cacert /usr/share/elasticsearch/config/certs/ca/ca.crt https://elasticsearch:9200; do
  echo "Waiting for Elasticsearch to be available..."
  sleep 5
done

# Create ILM policy
until curl -X PUT -u "elastic:${ELASTIC_PASSWORD}" --cacert /usr/share/elasticsearch/config/certs/ca/ca.crt \
  -H "Content-Type: application/json" \
  https://elasticsearch:9200/_ilm/policy/my_policy -d '
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_size": "50GB",
            "max_age": "30d"
          }
        }
      },
      "warm": {
        "actions": {
          "shrink": {
            "number_of_shards": 1
          }
        }
      },
      "cold": {
        "actions": {
          "freeze": {}
        },
        "min_age": "60d"
      },
      "delete": {
        "min_age": "90d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}' | grep -q '^{"acknowledged":true}'; do sleep 10; done