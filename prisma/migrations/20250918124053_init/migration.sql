-- CreateTable
CREATE TABLE `harvests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scope` VARCHAR(191) NULL DEFAULT 'Apiary',
    `apiary_id` INTEGER NOT NULL,
    `apply_to_all_hives` BOOLEAN NOT NULL DEFAULT false,
    `hive_id` INTEGER NULL,
    `name` VARCHAR(191) NULL,
    `harvest_date` DATETIME(3) NOT NULL,
    `product_type` ENUM('HONEY', 'WAX', 'PROPOLIS', 'POLLEN', 'ROYAL_JELLY', 'BEE_BREAD', 'COMB_HONEY', 'OTHER') NOT NULL DEFAULT 'HONEY',
    `variety` VARCHAR(191) NULL,
    `total_quantity` DECIMAL(65, 30) NULL,
    `unit` VARCHAR(191) NULL DEFAULT 'kg',
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `treatments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scope` VARCHAR(191) NULL DEFAULT 'Apiary',
    `apiary_id` INTEGER NOT NULL,
    `apply_to_all_hives` BOOLEAN NOT NULL DEFAULT false,
    `hive_id` INTEGER NULL,
    `name` VARCHAR(191) NULL,
    `disease` VARCHAR(191) NULL,
    `treatment_product` VARCHAR(191) NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NULL,
    `input_as` VARCHAR(191) NULL DEFAULT 'Total',
    `total_quantity` DECIMAL(65, 30) NULL,
    `doses` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `harvests` ADD CONSTRAINT `harvests_apiary_id_fkey` FOREIGN KEY (`apiary_id`) REFERENCES `apiary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `harvests` ADD CONSTRAINT `harvests_hive_id_fkey` FOREIGN KEY (`hive_id`) REFERENCES `hives`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `treatments` ADD CONSTRAINT `treatments_apiary_id_fkey` FOREIGN KEY (`apiary_id`) REFERENCES `apiary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `treatments` ADD CONSTRAINT `treatments_hive_id_fkey` FOREIGN KEY (`hive_id`) REFERENCES `hives`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
