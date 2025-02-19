-- CreateTable
CREATE TABLE `question_answers` (
    `id` VARCHAR(30) NOT NULL,
    `question_id` VARCHAR(30) NOT NULL,
    `question_option_id` VARCHAR(30) NOT NULL,
    `line_user_id` VARCHAR(191) NOT NULL DEFAULT '',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `question_answers` ADD CONSTRAINT `question_answers_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_answers` ADD CONSTRAINT `question_answers_question_option_id_fkey` FOREIGN KEY (`question_option_id`) REFERENCES `question_options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
