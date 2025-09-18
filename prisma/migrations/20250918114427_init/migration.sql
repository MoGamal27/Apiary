-- CreateTable
CREATE TABLE `feedings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `apiary_id` INTEGER NOT NULL,
    `apply_to_all_hives` BOOLEAN NOT NULL DEFAULT false,
    `hive_id` INTEGER NULL,
    `name` VARCHAR(191) NULL,
    `feeding_date` DATETIME(3) NOT NULL,
    `feeding_type` VARCHAR(191) NULL,
    `food_type` VARCHAR(191) NULL,
    `ratio` VARCHAR(191) NULL DEFAULT 'None',
    `note` VARCHAR(191) NULL,
    `input_as` VARCHAR(191) NULL DEFAULT 'Total',
    `quantity` DECIMAL(65, 30) NULL,
    `unit` VARCHAR(191) NULL DEFAULT 'kg',
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `feedings` ADD CONSTRAINT `feedings_apiary_id_fkey` FOREIGN KEY (`apiary_id`) REFERENCES `apiary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedings` ADD CONSTRAINT `feedings_hive_id_fkey` FOREIGN KEY (`hive_id`) REFERENCES `hives`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
