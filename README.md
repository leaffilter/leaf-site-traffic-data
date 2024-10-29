# Leaf Site Traffic Data

Using the Cloudflare v4 zones endpoint to get data:

* by Domain
* over Timeframe
* by Hour

```url
https://api.cloudflare.com/client/v4/zones/{{ZONE_ID_LEAF_FILTER_COM}}/dns_analytics/report/bytime?since=2024-09-10T12:00:00Z&time_delta=hour
```

## Usage

This script will generate the data file.

```script
npm run process
```
