package com.ashutosh0640.inventy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.cache.annotation.EnableCaching;


@EnableAsync
@EnableCaching
@EnableScheduling
@SpringBootApplication
public class InventyApplication {

	public static void main(String[] args) {
		SpringApplication.run(InventyApplication.class, args);
	}

}
