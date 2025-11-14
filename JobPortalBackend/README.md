JobPortal Backend - Spring Boot

Instructions:
1. Update src/main/resources/application.properties with your MySQL credentials and jwt.secret.
2. Build and run: mvn spring-boot:run
3. Default port: 8080. APIs under /api/

Seeding demo data (optional):
1. The application no longer runs `data.sql` automatically—your runtime data will persist.
2. To refresh the database with demo content, run the script manually:
   ```bash
   mysql -u <db_user> -p jobportal < src/main/resources/data.sql
   ```
   Replace `<db_user>` with your MySQL username.
3. Alternatively, temporarily set `spring.sql.init.mode=always` in `application.properties`, start the app once to load the seed data, then revert the property back to `never`.
