deploy-build-dev:
	./deploy.sh env=dev build=true clean=false

deploy-build-production:
	./deploy.sh env=production build=true clean=false

deploy-dev:
	./deploy.sh env=dev build=false clean=false

deploy-production:
	./deploy.sh env=production build=false clean=false

destroy-dev:
	terraform destroy -input=false -auto-approve -var-file="env/dev.tfvars"

destroy-production:
	terraform destroy -input=false -auto-approve -var-file="env/production.tfvars"