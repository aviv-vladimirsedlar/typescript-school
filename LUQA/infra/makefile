deploy-dev:
	./deploy.sh env=dev clean=false

deploy-production:
	./deploy.sh env=production clean=false

destroy-dev:
	terraform destroy -input=false -auto-approve -var-file="env/dev.tfvars"

destroy-production:
	terraform destroy -input=false -auto-approve -var-file="env/production.tfvars"