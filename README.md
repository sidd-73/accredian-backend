To make the send to be sent successfully,

Do not use your google account password.
Create a app password and use it, to avoid authentication errors


1 sign in your Gmail account.
2. Create an app password.
3.go to your nodemailer.createTransport({
pass:"your 16 digit app password here"
}) and replace the pass with "16 digit app password"

To generate the app password follow this steps:
a. Sign in your Gmail account
b. Go to manage account.
c.in the search bar:type app password (select the one under security)
d. you will be directed to app passwords,go to select app and choose other(custom name)
e. give it a name e.g mailapp and click on generate
f. You will see your password(mainly on pale yellow background and 16 digit in number) copy it and paste it.