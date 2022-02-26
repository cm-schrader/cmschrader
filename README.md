# cmschrader.com
This repository is my personal portfolio website [cmschrader.com](https://cmschrader.com).  
It contains a variety of info on my skills and past experiences.  The page is written entirely 
pure HTML and CSS.  While not the most flexible of formats, this was quick to develop and 
makes for a very light weight cite.  It is purely static as required by Github Pages, the 
service used to host it.

To deploy to live, use the two commands.  The first command returns the [COMMIT ID] used
in the second command. 
git subtree split --prefix dist 3d
git push origin [COMMIT ID]:gh-pages --force

For some reason, after this you must reconfigure the custom domain on github