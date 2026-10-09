FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn clean package -DskipTests -q

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY zscaler-root-ca.pem /tmp/zscaler-root-ca.pem
RUN keytool -importcert \
        -alias zscaler-root-ca \
        -file /tmp/zscaler-root-ca.pem \
        -keystore $JAVA_HOME/lib/security/cacerts \
        -storepass changeit \
        -noprompt && \
    rm /tmp/zscaler-root-ca.pem
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8097
ENTRYPOINT ["java", "-jar", "app.jar"]
