docker build -t filio-svelte .
docker run -d \
-p 3100:3100 \
	--name filio-svelte \
  	--restart always \
   filio-svelte
