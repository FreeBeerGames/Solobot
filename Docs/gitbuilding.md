# Solobot Project - Build Instructions - Git Guide/Workflow
<br />

## Abstract

The source code and workflow will be controlled by Git, written by Linux 
developer Linus Torvalds, and hosted on the free for open source Git hosting 
site [**GitHub**][1]. The GitHub organization [**FreeBeerGames**][2] has been
setup for our project. If you haven't been added as part of the dev team for 
the Github organization then please let [email me](cmg0030@auburn.edu) and let
me know so I can give you pull rights for the repo.

The Solobot development repo can be found at [**FreeBeerGames/Solobot**][3]. 
The GitHub repo home page render the GitHub Flavored Markdown (GFM) in the 
[**README.md file**][4]. This markdown language is very convienient and can
result in very simplified HTML documentation. The same README.md file is used
on the GitHub Project Page hosted at 
[**freebeergames.github.com/Solobot**][5]. The site located at that URL is
simply the gh-pages branch of our repo, we can update it as needed and is
actually part of our open source repo.

## Git Workflow Overview

Git is a source/version control system which can be downloaded from its
[**official page][6]. The Unity IDE is *not* available for Linux, so we will
need to develop using Windows. So go ahead and download the latest stable
Windows release of the Git utility. The Git utility is your client, you can
run it from the Windows command line with the command `git`. There is a
[**nice cheatsheet**][7] published by the developer's at Heroku that should
come in handy for those that have never used Git before.

There are a couple of different ways that Git can be used. Since we're using
Github and developing on Windows it makes sense to download the 
[**GitHub for Windows client**][8] which will is a GUI built on top of the Git
CLI for working with remote GitHub repositories in Windows. Once you have this
client installed you have all that you need. If you have not installed the
free version of the Unity engine in Windows please browse to Unity3D and
download it. Using a Git workflow, we will all be able to have our own
development environment, and hopefully everyone will be able to contribute to
the project via Git.

## Forks vs. Clones (The Movie)

Okay, so most people don't realize this, but forking is actually *not* 
something that is defined by the Git protocol, and it is added functionality
provided by Github with server-side processing. Instead, a git client
runs a `clone` command. What this does is basically create a new git repository
either in the current working directory or in a given location, pulling
the contents of a remote repository so that a local copy of the repo is made.
When you create a **fork** on GitHub, what is happening is that GitHub on the
server-side is cloning a new remote repository associated with your GitHub
account from the remote repository you are forking.

So in the context of our project what I would recommend doing is forking the
repository on GitHub, (top right of the repo page). Then on your clone your
own fork locally using the **Clone in Windows** button. At this point the
Github Windows client should have popped up and downloaded the remote repo.

Even if you do not want to use the GitHub for Windows GUI, I recommend that
you download it anyway because it comes with Git Shell, which is a command
line shell which allows you to use Linux commands and directory structure
on Windows. Regardless of what you use, if you have git installed, after
you have forked the main repo [**FreeBeerGames/Solobot**][3] you can run
the following command in order to clone the repo to the current working
directory.

    git clone https://github.com/FreeBeerGames/Solobot.git

You should now right click the repository in the Github client and click
**Open Shell Here** and setup our upstream remote repository. You can
do this by issuing the following command:

    git remote add upstream https://github.com/FreeBeerGames/Solobot.git
	
You can then run the following command to view all the remote repositories
associated with the local repo:

    git remote

The last command should give you an output of:

    origin
	upstream

This indicates that you have two remote repositories associated with the
current local repository. The original repository you cloned from. That is
your fork unique to your GitHub account. The other remote repository is the
upstream repository located at [**FreeBeerGames/Solobot**][3]. If you run the
following command with the verbose flag you will see that you have both
fetch and push rights for your origin repository, however you may only fetch
from the upstream repo.

In order to commit changes that you've made locally to your remote fork of the
project you should issue the following series of commands:

    git add .
	git commit -a -m "Commit message/what you changed goes here"
	git push origin master

At this point you will have uploaded your changes to your remote fork of the
project. In order to get your changes merged back into the project you
submit a pull request which will merge it into the main repository. You can
submit a pull request by browsing to your remote fork on GitHub and clicking
the **Pull Request** button torwards the top of the page.

It may be the case, however, that since the last time you forked the main repo
we have accepted a pull request and merged changes into the upstream
repository. If this is the case, your will have to merge the changes first by
pulling the new changes in the upstream remote, then pushing everything once
again to your remote fork

    git pull upstream master
	git push origin master
	
You may then complete your pull request.
	
[1]: http://github.com/
[2]: http://github.com/FreeBeerGames/
[3]: http://github.com/FreeBeerGames/Solobot/
[4]: https://raw.github.com/FreeBeerGames/Solobot/master/README.md
[5]: http://freebeergames.github.com/Solobot/
[6]: http://git-scm.com/
[7]: https://na1.salesforce.com/help/doc/en/salesforce_git_developer_cheatsheet.pdf
[8]: http://windows.github.com/
[9]: http://unity3d.com/