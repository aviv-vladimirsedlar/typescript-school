#!/bin/bash

# Step 1: Apply the configuration
kubectl apply -f fastify-postgres.yaml

# Step 2: Wait for the pod to be ready
echo "Waiting for PostgreSQL pod to start..."
kubectl wait --for=condition=ready pod -l app=fastify-postgres --timeout=120s

# Step 3: Port forward to expose PostgreSQL on localhost:5432
echo "Starting port forwarding to localhost:5432..."
kubectl port-forward svc/fastify-postgres 5432:5432 --address=0.0.0.0 &
PORT_FORWARD_PID=$!

echo "PostgreSQL is running and accessible at localhost:5432"
echo "To stop port forwarding, use: kill $PORT_FORWARD_PID"