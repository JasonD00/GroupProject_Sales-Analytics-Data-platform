package com.salesplatform.sales_analytics_api.config;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.sql.DataSource;

/*
        Creates a Flyway bean that tells SpringBoot to run
        database migration automatically when the application starts.

        @Bean(initMethod = "migrate"): registers Flyways object as a Springbean
        and runs migrate() after the bean is created.

        method param: (DataSource dataSource) injects the applications db
        connection settings into Flyway

        Result is that Migrations run automatically on start up
 */

@Configuration
public class FlywayConfig {

    @Bean(initMethod = "migrate")
    public Flyway flyway(DataSource dataSource) {
        return Flyway.configure()
                .dataSource(dataSource)
                .schemas("dbo")
                .locations("classpath:db/migration") //where to find the migrated SQL files
                .baselineOnMigrate(true) // Allow Flyway to track existing db
                .load(); // build the instance
    }
}