resource "aws_ecr_repository" "repo" {
  name = "${var.family}/${var.repoName}"
}

resource "aws_ecr_repository_policy" "repo_policy" {
  repository = "${aws_ecr_repository.repo.name}"

  policy = <<EOF
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "EverybodyRead",
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "arn:aws:iam::785933498059:root",
          "arn:aws:iam::817276302724:root",
          "arn:aws:iam::874528425052:root",
          "arn:aws:iam::642366168795:root",
          "arn:aws:iam::743504312842:root"
        ]
      },
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:BatchGetImage",
        "ecr:GetDownloadUrlForLayer"
      ]
    },
    {
      "Sid": "SlaveDockerWrite",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::817276302724:user/app.slave.docker"
      },
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:BatchGetImage",
        "ecr:CompleteLayerUpload",
        "ecr:GetDownloadUrlForLayer",
        "ecr:InitiateLayerUpload",
        "ecr:PutImage",
        "ecr:UploadLayerPart"
      ]
    }
  ]
}
EOF
}
