-- CreateTable
CREATE TABLE `inspections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `apiary_id` INTEGER NOT NULL,
    `hive_id` INTEGER NOT NULL,
    `inspection_date` DATETIME(3) NOT NULL,
    `inspection_time` VARCHAR(191) NULL,
    `strength` INTEGER NULL,
    `strength_category` ENUM('VERY_WEAK', 'WEAK', 'MODERATE', 'STRONG', 'VERY_STRONG') NULL,
    `temperament` ENUM('CALM', 'NORMAL', 'NERVOUS', 'AGGRESSIVE', 'DEFENSIVE') NULL,
    `supers_count` INTEGER NULL,
    `frames_count` INTEGER NULL,
    `notes` VARCHAR(191) NULL,
    `weight` DOUBLE NULL,
    `weight_unit` VARCHAR(191) NULL,
    `include_weather` BOOLEAN NULL DEFAULT false,
    `weather_conditions` VARCHAR(191) NULL,
    `temperature` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspection_queen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inspection_id` INTEGER NOT NULL,
    `queen_seen` BOOLEAN NULL DEFAULT false,
    `queen_cells` ENUM('NONE', 'SWARM', 'SUPERSEDURE', 'EMERGENCY') NULL,
    `swarmed` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `inspection_queen_inspection_id_key`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspection_brood` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inspection_id` INTEGER NOT NULL,
    `eggs_present` BOOLEAN NULL DEFAULT false,
    `capped_brood` BOOLEAN NULL DEFAULT false,
    `uncapped_brood` BOOLEAN NULL DEFAULT false,
    `excessive_drones` BOOLEAN NULL DEFAULT false,
    `laying_pattern` ENUM('NONE', 'NOT_UNIFORM', 'MOSTLY_UNIFORM', 'UNIFORM') NULL,
    `population_level` ENUM('LOW', 'AVERAGE', 'HIGH') NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `inspection_brood_inspection_id_key`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspection_conditions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inspection_id` INTEGER NOT NULL,
    `equipment_condition` ENUM('DAMAGED', 'FAIR', 'GOOD') NULL,
    `odor` ENUM('NORMAL', 'FOUL', 'SOUR') NULL,
    `brace_comb` BOOLEAN NULL DEFAULT false,
    `excessive_propolis` BOOLEAN NULL DEFAULT false,
    `dead_bees` BOOLEAN NULL DEFAULT false,
    `moisture` BOOLEAN NULL DEFAULT false,
    `mold` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `inspection_conditions_inspection_id_key`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspection_frames` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inspection_id` INTEGER NOT NULL,
    `frames_bees` INTEGER NULL,
    `frames_brood` INTEGER NULL,
    `frames_honey` INTEGER NULL,
    `frames_pollen` INTEGER NULL,
    `frames_foundation` INTEGER NULL,
    `honey_stores` ENUM('LOW', 'AVERAGE', 'HIGH', 'ABUNDANT') NULL,
    `pollen_stores` ENUM('LOW', 'AVERAGE', 'HIGH', 'ABUNDANT') NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `inspection_frames_inspection_id_key`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspection_activities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inspection_id` INTEGER NOT NULL,
    `bee_activity` ENUM('LOW', 'AVERAGE', 'HIGH') NULL,
    `orientation_flights` ENUM('LOW', 'AVERAGE', 'HIGH') NULL,
    `pollen_arriving` ENUM('LOW', 'AVERAGE', 'HIGH') NULL,
    `foraging_bees` ENUM('LOW', 'AVERAGE', 'HIGH') NULL,
    `bees_per_minute` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `inspection_activities_inspection_id_key`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspection_problems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inspection_id` INTEGER NOT NULL,
    `diseases` VARCHAR(191) NULL,
    `pests` VARCHAR(191) NULL,
    `predation` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `inspection_problems_inspection_id_key`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspection_treatments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inspection_id` INTEGER NOT NULL,
    `treatments` VARCHAR(191) NULL,
    `varroa_drop_count` INTEGER NULL,
    `actions_taken` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `inspection_treatments_inspection_id_key`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inspections` ADD CONSTRAINT `inspections_apiary_id_fkey` FOREIGN KEY (`apiary_id`) REFERENCES `apiary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspections` ADD CONSTRAINT `inspections_hive_id_fkey` FOREIGN KEY (`hive_id`) REFERENCES `hives`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspection_queen` ADD CONSTRAINT `inspection_queen_inspection_id_fkey` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspection_brood` ADD CONSTRAINT `inspection_brood_inspection_id_fkey` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspection_conditions` ADD CONSTRAINT `inspection_conditions_inspection_id_fkey` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspection_frames` ADD CONSTRAINT `inspection_frames_inspection_id_fkey` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspection_activities` ADD CONSTRAINT `inspection_activities_inspection_id_fkey` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspection_problems` ADD CONSTRAINT `inspection_problems_inspection_id_fkey` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspection_treatments` ADD CONSTRAINT `inspection_treatments_inspection_id_fkey` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
