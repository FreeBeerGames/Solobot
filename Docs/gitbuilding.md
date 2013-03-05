# Solobot Project - Build Instructions - Git Guide/Workflow

## Abstract

<p>
The source code and workflow will be controlled by Git, written by Linux 
developer Linus Torvalds, and hosted on the free for open source Git hosting 
site  [**Github**][1]. The Github organization [**FreeBeerGames**][2] has been
setup for our project. If you haven't been added as part of the dev team for 
the Github organization then please let [email me](cmg0030@auburn.edu) and let
me know so I can give you pull rights for the repo.
</p>

<p>
The Solobot development repo can be found at [**FreeBeerGames/Solobot**][3]. 
The Github repo home page render the Github Flavored Markdown (GFM) in the 
[**README.md file**][4]. This markdown language is very convienient and can
result in very simplified HTML documentation. The same README.md file is used
on the Github Project Page hosted at 
[**freebeergames.github.com/Solobot**][5]. The site located at that URL is
simply the gh-pages branch of our repo, we can update it as needed and is
actually part of our open source repo.
</p>

## Git Workflow Overview

<p>
Git is a source/version control system which can be downloaded from its
[**official page][6]. The Unity IDE is *not* available for Linux, so we will
need to develop using Windows. So go ahead and download the latest stable
Windows release of the Git utility. The Git utility is your client, you can
run it from the Windows command line with the command `git`. There is a
[**nice cheatsheet**][7] published by the developer's at Heroku that should
come in handy for those that have never used Git before.
</p>

<p>
There are a couple of different ways that Git can be used. Since we're using
Github and developing on Windows it makes sense to download the 
[**Github for Windows client**][8] which will is a GUI built on top of the Git
CLI for working with remote Github repositories in Windows. Once you have this
client installed you have all that you need. If you have not installed the
free version of the Unity engine in Windows please browse to Unity3D and
download it. Using a Git workflow, we will all be able to have our own
development environment, and hopefully everyone will be able to contribute to
the project via Git.
</p>

## Forks vs. Clones (The Movie)

<p>
Okay, so most people don't realize this, but forking is actually *not* 
something that is defined by the Git protocol, and it is added functionality
provided by Github with server-side processing. Instead, a git client
runs a `clone` command.
</p>

[1]: http://github.com/
[2]: http://github.com/FreeBeerGames/
[3]: http://github.com/FreeBeerGames/Solobot/
[4]: https://raw.github.com/FreeBeerGames/Solobot/master/README.md
[5]: http://freebeergames.github.com/Solobot/
[6]: http://git-scm.com/
[7]: https://na1.salesforce.com/help/doc/en/salesforce_git_developer_cheatsheet.pdf
[8]: http://windows.github.com/
[9]: http://unity3d.com/