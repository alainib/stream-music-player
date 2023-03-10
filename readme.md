the stack is composed of 3 parts : Elastic, server & front

# First start

##### Install client files

> cd client  
> yarn install

##### Install server files

> cd ../server
> yarn install

Files in server's folder are


- `app.js` : the file started by nodeJs, who serve static files & create API also
- `api.js` : the API queries are listened here and are made here to elasticSearch 
- `scan_music_folder` : set of various scripts
  - `scan.js` : this script scan the `config.musicSrcPath` path and write all music info into `output.ndjson` file ( title album artist genre path)
  - `createFolderImage.js` : rename Folder.jpg to folder.jpg & create jpg vignets for very fast preview

now we need to scan the folder to create the output.ndjson, setup `musicSrcPath` in `../config.js` then run the following command, we import the file later when kibana will be ready

> node scan.js
> (you can start next step will this finish because it can take a lot of time like 30minutes for 100go)

##### Install docker stack

> cd ../es_config
> docker-compose up

##### It should create a container in docker named "elastic" with 2 sub containers :

- elasticsearch : http://localhost:9200/ it's the api port to make query
- kibana : http://localhost:5601/app/kibana#/dev_tools/console it's kibana interface to test query with graphic interface

username : elastic
password : elastic321 (Change it on server of course)

### ElasticSearch data

Data can be found here in `./elasticdata` folder, it's already used by docker-compose to store data.

You can update them.
To create a new ES index and import data, first you need a ndjson file (it's a json file where each row is on a new line instead of separated with ",", there is only website to convert json to ndjson).
I generate this ndjson file by parsing all my mp3 inside a given folder and getting path and many exif about artist/genre/album/title then uploading it on kibana interface ( see `scan.js` before )

To import data :

- go to `http://localhost:5601/app/kibana#/home` then click on `Upload data from log file Import a CSV, NDJSON, or log file `
- drag and drop `output.ndjson` generated by `node scan.js` before, see if data are parsed well, click on `Import` button at the end of the page, fill the `index name` you want BUT DONT CLICK IMPORT , click `advanced`
- open `/elastic/mapping_es.js`, copy&past contents of `index settings` and `mappings` for proper indexation
- click `Import`

##### Test the import or data

- go to kibana home ( `http://localhost:5601/app/kibana#/home`) , click burger menu on top left then `Management` > `Dev tools`
  you can found many query inside `/elastic/mapping_es.js`

## Start the stack each times

#### run docker

> cd /elastic
> docker-compose up -d

#### Run server

> cd ../server
> yarn start

it start nodejs server on Config.apiIp + Config.apiPort 
test http://127.0.0.1:3001/api/test


#### Run client (from another cmd)

> cd /client  
> yarn start 

it start the front on http://localhost:3000/
