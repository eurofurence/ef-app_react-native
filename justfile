set dotenv-load

default:
	just --list

prebuild *ARGS:
	bunx expo prebuild {{ARGS}}

switch-env NAME:
	#!/bin/bash
	if [ ! -f ./.env.{{NAME}} ]; then echo "Target environment '{{NAME}}' does not exist."; exit 1; fi
	cp ./.env.{{NAME}} ./.env
	echo "Switched to environment '{{NAME}}'."

# Helpers for executing a command directly or via shell.
ASSERT_LINUX := if os_family() == "windows" { "wsl -- bash -ic '" } else { "" }
ASSERT_LINUX_END := if os_family() == "windows" { "'" } else { "" }

platform := 'android'
profile := 'preview'
build PLATFORM=platform PROFILE=profile:
    {{ASSERT_LINUX}} bunx eas build --platform {{PLATFORM}} --profile {{PROFILE}} --local {{ASSERT_LINUX_END}}

cloud-build PLATFORM=platform PROFILE=profile:
    bunx eas build --platform {{PLATFORM}} --profile {{PROFILE}} # IF BUNX DOES NOT WORK USE BUN X INSTEAD OF BUNX
cloud-submit PLATFORM=platform:
    bunx eas submit --platform {{PLATFORM}} # IF BUNX DOES NOT WORK USE BUN X INSTEAD OF BUNX
