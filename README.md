# 2b2t Timeline
A rework of the original [2b2t Timeline](https://2b2t.miraheze.org/wiki/Sato%27s_Timeline), built with modern web technologies and an ancient look.

## How to contribute
### Adding events
> [!IMPORTANT]
> Only events that are on the [wiki timeline](https://2b2t.miraheze.org/wiki/Timeline) are allowed to be added.

Edit the `timeline.json` and add to the `events` array the following structure:
```json
{
    "date": "YYYY-MM-DDThh:mm:ssZ", /* ISO 8601 date format, set 00:00 if time is unknown */
    "description": "FartMC discovers the popbob sex dupe", /* A brief description of the event */
    "isMajor": false, /* True if the event is considered a major turning point in the timeline */
    "wikiUrl": null /* If possible a URL to the wiki page or another source */
}
```

### Adding ages
> [!IMPORTANT]
> This should be carefully discussed in advance, please open an issue first.

First define which events will mark the start and end of the age and set their `isMajor` to `true`.
Then edit the `timeline.json` and add to the `ages` array the following structure:
```json
{
    "startDate": "YYYY-MM-DDThh:mm:ssZ", /* ISO 8601 date format, set 00:00 if time is unknown */
    "endDate": "YYYY-MM-DDThh:mm:ssZ", /* ISO 8601 date format like above */
    "items": [
        /* Array of paths of the groups' banners  */
    ],
    "name": "Age of Unrest",
    "version": [
        /* List of minecraft versions */
    ],
    "playerCount": [
        /* Estimated player count at start and end of the age */
    ],
    "color": "#abcdef", /* Hex color code for the age */
    "background": "ages/unrest.png" /* Path to the background image for the age */
}
```

### Website improvements
PRs are wecome!

## Credits
Thanks to Sato86 and all the 2b2t wiki contributors for their work and research.

## License
This website is licensed under the [GNU General Public License v3.0](LICENSE), with additional conditions listed in the [NOTICE](NOTICE) file.
