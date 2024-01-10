
#!/bin/bash

USER="ec2-user"
SERVER_ADDRESS="ec2-3-7-72-9.ap-south-1.compute.amazonaws.com"
RSYNC_PRIVATE_KEY="-e ssh -i ./key/airtable-maps-test.pem"
PRIVATE_KEY="./key/airtable-maps-test.pem"

SOURCE_DIR="./"
EXCLUDE_FILE="--exclude node_modules --exclude .git --exclude --exclude key"
DESTINATION_DIR="~/socket-server"

# transfer the files to the remote machine
rsync -avz $EXCLUDE_FILE "$RSYNC_PRIVATE_KEY" $SOURCE_DIR $USER@$SERVER_ADDRESS:$DESTINATION_DIR

# reconfigure and restart the server on the remote machine
ssh -i $PRIVATE_KEY $USER@$SERVER_ADDRESS <<EOF
    cd $DESTINATION_DIR
    npm install
    sudo service socket-server restart
EOF

