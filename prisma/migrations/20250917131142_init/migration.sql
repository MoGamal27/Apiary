-- CreateTable
CREATE TABLE `hives` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `apiary_id` INTEGER NOT NULL,
    `status` VARCHAR(191) NULL,
    `hive_identifier` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `type` ENUM('LANGSTROTH', 'TOP_BAR', 'WARRE', 'FLOW', 'NATIONAL', 'COMMERCIAL', 'OTHER') NULL,
    `source` VARCHAR(191) NULL,
    `purpose` ENUM('HONEY_PRODUCTION', 'POLLINATION', 'QUEEN_BREEDING', 'NUC_PRODUCTION', 'RESEARCH', 'EDUCATION', 'CONSERVATION', 'OTHER') NULL,
    `created_date` DATETIME(3) NULL,
    `note` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hive_colony_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hive_id` INTEGER NOT NULL,
    `strength` INTEGER NULL,
    `strength_category` VARCHAR(191) NULL,
    `temperament` VARCHAR(191) NULL,
    `supers_count` INTEGER NULL DEFAULT 0,
    `frames_count` INTEGER NULL DEFAULT 10,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hive_colony_info_hive_id_key`(`hive_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hive_queen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hive_id` INTEGER NOT NULL,
    `has_queen` BOOLEAN NULL DEFAULT false,
    `queen_status` VARCHAR(191) NULL,
    `queen_id` VARCHAR(191) NULL,
    `queen_hatched_year` INTEGER NULL,
    `queen_installed_date` DATETIME(3) NULL,
    `queen_state` VARCHAR(191) NULL,
    `queen_race` VARCHAR(191) NULL,
    `queen_clipped` BOOLEAN NULL DEFAULT false,
    `queen_marked` BOOLEAN NULL DEFAULT false,
    `queen_note` VARCHAR(191) NULL,
    `queen_origin` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hive_queen_hive_id_key`(`hive_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hives` ADD CONSTRAINT `hives_apiary_id_fkey` FOREIGN KEY (`apiary_id`) REFERENCES `apiary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hive_colony_info` ADD CONSTRAINT `hive_colony_info_hive_id_fkey` FOREIGN KEY (`hive_id`) REFERENCES `hives`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hive_queen` ADD CONSTRAINT `hive_queen_hive_id_fkey` FOREIGN KEY (`hive_id`) REFERENCES `hives`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
