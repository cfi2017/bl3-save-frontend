#!/bin/sh

cd src/assets
curl -L https://github.com/apocalyptech/bl3-cli-saveedit/raw/master/bl3save/resources/balance_to_inv_key.json.xz -o balance_to_inv_key.json.xz
curl -L https://github.com/apocalyptech/bl3-cli-saveedit/raw/master/bl3save/resources/inventoryserialdb.json.xz -o inventoryserialdb.json.xz
curl -L https://github.com/apocalyptech/bl3-cli-saveedit/raw/master/bl3save/resources/balance_name_mapping.json.xz -o balance_name_mapping.json.xz

xz -fd balance_to_inv_key.json.xz
xz -fd inventoryserialdb.json.xz
xz -fd balance_name_mapping.json.xz

mv inventoryserialdb.json inventory_raw.json
