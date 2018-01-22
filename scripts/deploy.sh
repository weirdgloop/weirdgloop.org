#!/bin/bash

echo "${SSH_PRIVATE_KEY}" > id_rsa
chmod 700 id_rsa
mkdir "${HOME}/.ssh"
echo "${SSH_HOST_KEY}" > "${HOME}/.ssh/known_hosts"
rsync -rcvz --delete-after --delete-excluded --rsh='ssh -p ${SSH_PORT}' _site/ ${SSH_HOSTNAME}:/srv/weirdgloop