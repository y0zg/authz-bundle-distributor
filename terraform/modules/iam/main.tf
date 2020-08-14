resource "aws_iam_user" "user" {
  for_each = toset(var.environments)
  name  = "${var.family}.${var.repoName}.${each.value}"
}

resource "aws_iam_access_key" "key" {
  for_each = toset(var.environments)
  user    = "${aws_iam_user.user[each.value].name}"
}

resource "aws_iam_policy" "policy" {
  for_each    = toset(var.environments)
  name        = "${var.family}.${var.repoName}.${each.value}"
  path        = "/"
  description = "Policy for ${var.repoName} in ${each.value}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ssm:DescribeAssociation",
                "ssm:GetDeployablePatchSnapshotForInstance",
                "ssm:GetDocument",
                "ssm:GetManifest",
                "ssm:GetParameter",
                "ssm:GetParameters",
                "ssm:GetParametersByPath",
                "ssm:ListAssociations",
                "ssm:ListInstanceAssociations"
            ],
            "Resource": [
                "arn:aws:ssm:eu-west-1:817276302724:parameter/NGSS/${var.repoName}/${each.value}",
                "arn:aws:ssm:eu-west-1:817276302724:parameter/NGSS/${var.repoName}/${each.value}/*",
                "arn:aws:ssm:eu-west-1:817276302724:parameter/NGSS/global",
                "arn:aws:ssm:eu-west-1:817276302724:parameter/NGSS/global/*"
            ]
        }
    ]
}
EOF
}

resource "aws_iam_user_policy_attachment" "attach" {
  for_each    = toset(var.environments)
  user       = "${aws_iam_user.user[each.value].name}"
  policy_arn = "${aws_iam_policy.policy[each.value].arn}"
}

resource "aws_ssm_parameter" "AWS_ACCESS_KEY_ID" {
  for_each    = toset(var.environments)
  name  = "/${upper(replace(aws_iam_access_key.key[each.value].user, "/\\..+$/", ""))}${replace(replace(aws_iam_access_key.key[each.value].user, "/^[^\\.]+/", ""), ".", "/")}/AWS_ACCESS_KEY_ID"
  type  = "String"
  value = aws_iam_access_key.key[each.value].id
  overwrite = true
}

resource "aws_ssm_parameter" "AWS_SECRET_ACCESS_KEY" {
  for_each    = toset(var.environments)
  name  = "/${upper(replace(aws_iam_access_key.key[each.value].user, "/\\..+$/", ""))}${replace(replace(aws_iam_access_key.key[each.value].user, "/^[^\\.]+/", ""), ".", "/")}/AWS_SECRET_ACCESS_KEY"
  type  = "String"
  value = aws_iam_access_key.key[each.value].secret
  overwrite = true
}


