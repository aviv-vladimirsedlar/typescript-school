#!/bin/bash

# Step 1: Scale down the fastify-postgres deployment to 0 replicas
echo "Putting PostgreSQL service to sleep by scaling down the deployment..."
kubectl scale deployment fastify-postgres --replicas=0

# Step 2: Find and stop the port-forwarding process
echo "Stopping port forwarding..."
# Find the process ID (PID) of the port-forwarding command
PORT_FORWARD_PID=$(ps aux | grep "kubectl port-forward svc/fastify-postgres 5432:5432" | grep -v grep | awk '{print $2}')

if [ -n "$PORT_FORWARD_PID" ]; then
  # Kill the port-forwarding process if found
  kill $PORT_FORWARD_PID
  echo "Port forwarding stopped."
else
  echo "No port forwarding process found."
fi

echo "PostgreSQL service is now stopped."