# weirdgloop.org

This repository contains the source code that is used to build the Weird Gloop [website](http://weirdgloop.org). The site is built using [Jekyll](https://jekyllrb.com/), which means that editing and creating pages on the site is as simple as changing Markdown files. The configuration for the site is stored in `_config.yml`.

Commits pushed to this repository get built using CI and then deployed to web servers immediately if successful. Tests are conducted with `htmlproofer` to ensure that all HTML is adequate and there are no issues - the CI build and deployment will fail if issues arise.

## License
This repo uses GNU GPLv3, see [this file](LICENSE).