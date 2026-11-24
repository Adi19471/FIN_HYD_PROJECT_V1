# Spring Boot backend image for Render (Render has no native Java runtime,
# so it builds and runs this Dockerfile).
#
#   Stage 1 builds the jar with Maven; stage 2 runs it on a small JRE.
#   Configuration comes from environment variables - see
#   src/main/resources/application-cloud.properties and DEPLOY.md.

# ---------- build ----------
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
# Dependencies first, so they are cached between builds.
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q -DskipTests package

# ---------- run ----------
FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --uid 1001 app
COPY --from=build /app/target/*.jar app.jar
USER app

ENV SPRING_PROFILES_ACTIVE=cloud
# Render free: 512 MB RAM. Keep the heap well under it.
ENV JAVA_OPTS="-Xms128m -Xmx320m -XX:MaxMetaspaceSize=160m -XX:+UseSerialGC -XX:TieredStopAtLevel=1 -Xss512k"

EXPOSE 8881
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
