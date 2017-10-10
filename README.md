---
title: "ChatRoom"
date: 2017-10-10
author: Paramansh Singh
tags:
 - 2nd semester 2016-17
 - project
categories:
 - project
---
This is a chat-room built using nodeJS and websockets. A person can login to his account and he can access all the messages that have been sent after he joined the chat room.
A person can signup by entering a valid e-mail id and password.

The conversations take place in real time: that is the webpage is updated (new messsages displayed) without actually reloading the webpage with the help of sockets.
Also sessions have been implemented because of which a person need not login again and again while in the same browser session. 

All the messages, and their sender, date etc.  are stored in the database MongoDB modeled using mongooseJS

Implentation of persoonal messages has not yet been done, however it can be done with some changed in the code.
#### Github: [Chat Room](http://github.com/paramansh/websockets)
