-- CreateTable
CREATE TABLE `tasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE') NOT NULL DEFAULT 'PENDING',
    `type` VARCHAR(191) NULL,
    `apiary_id` INTEGER NOT NULL,
    `hive_id` INTEGER NULL,
    `priority` ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT') NOT NULL DEFAULT 'NORMAL',
    `title` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `start_time` VARCHAR(191) NULL,
    `end_date` DATETIME(3) NULL,
    `end_time` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `reminder` BOOLEAN NOT NULL DEFAULT false,
    `reminder_me` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_apiary_id_fkey` FOREIGN KEY (`apiary_id`) REFERENCES `apiary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_hive_id_fkey` FOREIGN KEY (`hive_id`) REFERENCES `hives`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
