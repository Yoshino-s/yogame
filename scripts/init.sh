set -e

rm ./node_modules/@types/strict-event-emitter-types/ -rf
mkdir ./node_modules/@types/strict-event-emitter-types/
cp ./node_modules/strict-event-emitter-types/types/src/index.d.ts ./node_modules/@types/strict-event-emitter-types/index.d.ts

rm ./node_modules/@types/typescript-json-schema/ -rf
mkdir ./node_modules/@types/typescript-json-schema/
cp ./node_modules/typescript-json-schema/dist/typescript-json-schema.d.ts ./node_modules/@types/typescript-json-schema/index.d.ts

rm ./node_modules/@types/ajv/ -rf
mkdir ./node_modules/@types/ajv/
cp ./node_modules/ajv/lib/ajv.d.ts ./node_modules/@types/ajv/index.d.ts

node ./scripts/generate-json-schema.js
