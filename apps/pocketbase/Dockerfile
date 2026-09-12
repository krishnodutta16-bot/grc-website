FROM alpine:3.21
ARG PB_VERSION=0.36.7
WORKDIR /app
RUN apk add --no-cache ca-certificates unzip wget \
 && wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" \
 && unzip "pocketbase_${PB_VERSION}_linux_amd64.zip" \
 && chmod +x /app/pocketbase \
 && rm -f "pocketbase_${PB_VERSION}_linux_amd64.zip" CHANGELOG.md LICENSE.md
COPY pb_hooks ./pb_hooks
COPY pb_migrations ./pb_migrations
COPY .pocketbase-version ./.pocketbase-version
EXPOSE 8090
CMD ["./pocketbase","serve","--http=0.0.0.0:8090","--dir=/data","--migrationsDir=./pb_migrations","--hooksDir=./pb_hooks"]
