CREATE TABLE `admin_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text,
	`type` enum('string','number','boolean','json') DEFAULT 'string',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `demo_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`preferredDate` varchar(100),
	`preferredTime` varchar(100),
	`platform` enum('Google Meet','Zoom','Teams','Phone') DEFAULT 'Google Meet',
	`status` enum('Pending','Confirmed','Completed','Cancelled') NOT NULL DEFAULT 'Pending',
	`confirmedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `demo_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `demo_slots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(100) NOT NULL,
	`time` varchar(100) NOT NULL,
	`isAvailable` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `demo_slots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`company` varchar(255),
	`projectType` enum('digital_marketing','web_development','data_analysis') NOT NULL,
	`budget` varchar(100),
	`timeline` varchar(100),
	`isDecisionMaker` boolean DEFAULT false,
	`status` enum('New','Contacted','Qualified','Demo Scheduled','Demo Completed','Won','Lost','Follow-up','Junk') NOT NULL DEFAULT 'New',
	`priority` boolean DEFAULT false,
	`notes` text,
	`source` varchar(100) DEFAULT 'chatbot',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('testimonial','case_study','service','page_section') NOT NULL,
	`title` varchar(255),
	`description` text,
	`content` text,
	`imageUrl` varchar(500),
	`author` varchar(255),
	`authorCompany` varchar(255),
	`isPublished` boolean DEFAULT false,
	`order` int DEFAULT 0,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_content_id` PRIMARY KEY(`id`)
);
