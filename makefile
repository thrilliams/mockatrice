run:
	deno run --allow-net --allow-read --allow-write --unstable main.ts
build:
	deno compile --allow-net --allow-read --allow-write --unstable --output mockatrice main.ts