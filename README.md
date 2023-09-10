## Web Media Player
this a simple media player built because
first i needed to listen to a playlist to stream only my favourite radios.<br>
there are lots of free streaming audio sites, but my preference is different.<br>
there are lots of front end framework but this one is made using vanilla js ✨<br>
requires latest browsers that support ES modules<br>
tested on Safari<br>
<br>
I ❤️ DOM
<br>

### Specs
#### Playlist metadata
* id (type:int)
* title (type:string)
* stream_url (type:string)
* signal (type:string)
* image (type:object)..
    logo (for radio)
    album (for music)
    poster (for movie)
* background (type:string)
* meta (type:object)
#### Sample
```
[
    {
        "id": 1,
        "title":"Radio radio",
        "signal": "00.0 FM",
        "stream_url": "stream url here",
        "image": {},
        "background": "",
        "meta": {}
    },
    {
        "id": 2,
        "title":"Radio radio",
        "signal": "01.0 FM",
        "stream_url": "stream url here",
        "image": {},
        "background": "",
        "meta": {}
    }
]
```
<br>

### Features
#### V1
* Player with play and volume
* Playlist only contains radio stream source

#### V1.1
* Playlist can contain music source (.mp3, .aac)
* Player can handle controls switching for different type of source (radio/music)
* Player has controls for music: prev, next, play/pause

#### V1.2
* Player can control to repeat playlist
* Player can control to shuffle playlist

#### V1.3
* Playlist can contain video source
* Player can handle video

#### V1.4
* Player can control to repeat playlist
* Player can control to shuffle playlist

<br><br>
### Dev Requirements
* sass installed to compile scss file
* server to serve the static files e.g.
    * `php -S localhost:8000`

### sass
Development:<br>
`sass --watch src/sass:css/`
<br>
Production:<br>
`sass src/sass/style.scss css/style.css --style compressed`

<br><br>
### Screenshots
Empty Player state<br>
![Empty State](screenshots/empty-state.png "Empty state")
<br>
Loaded Player state<br>
![Loaded State](screenshots/loaded-state.png "Loaded state")