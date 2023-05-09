## Web Media Player
this a simple media player built because
first i needed to listen to a playlist to stream my favourite radios
there are lots of free streaming audio sites, but my preference is different
there are lots of front end framework but this one is made using vanilla js
requiring latest browsers that support ES modules
<br><br>

### Specs
#### Playlist metadata
* title (string)
* stream_url (type:string)
* image (type:object)..
    logo (for radio)
    album (for music)
    poster (for movie)
* background (type:string)
* meta (type:object)
<br><br>

### Features
#### V1
* Player with play and volume
* Playlist only contains radio stream source
* Playlist loads from url and stores it on localstorage

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

#### V1.5
* Theme support