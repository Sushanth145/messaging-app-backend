this a backend nessing server which gives the two web pages namely auth and message

databases :

users:
id seriel
username
password
profilepic
bio

sessions:
sid
sess
expiret ime

messages:
id
senderid
recieverid
content
timesttamp
read_status (boolean)



in the auth i created :
i used the session based authentication for this page
1 post api on the login page
1 post api on the register page
1 post api on the logout page to delete the session
1 put api to update the profile photo and the bio
1 post api to add the friend in the friend list
1 get api to see the all friend list

