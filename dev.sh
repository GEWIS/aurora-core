#!/usr/bin/env bash
trap 'kill $(jobs -p)' EXIT
nodemon & nodemon -x npx tsoa spec-and-routes
