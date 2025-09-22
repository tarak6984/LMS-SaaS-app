# Deployment Guide

This guide covers various deployment options for the Learning Management System (LMS).

## 🚀 Quick Deploy Options

### Vercel (Recommended for Next.js)

1. **Connect your repository to Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Set environment variables in Vercel dashboard:**
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_VAPI_WEB_TOKEN`
   - `SENTRY_AUTH_TOKEN`

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Netlify

1. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Add environment variables in Netlify dashboard**

3. **Deploy via Git integration or CLI**

### Railway

1. **Deploy from GitHub:**
   ```bash
   railway login
   railway link
   railway up
   ```

2. **Add environment variables in Railway dashboard**

### DigitalOcean App Platform

1. **Create app.yaml:**
   ```yaml
   name: lms-app
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/lms-app
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     routes:
     - path: /
     envs:
     - key: NODE_ENV
       value: "production"
     - key: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
       value: "your-clerk-key"
     # Add other environment variables
   ```

## 🐳 Docker Deployment

### Local Docker

1. **Build the image:**
   ```bash
   docker build -t lms-app .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:3000 --env-file .env.local lms-app
   ```

### Docker Compose

1. **Start services:**
   ```bash
   docker-compose up -d
   ```

2. **Scale the application:**
   ```bash
   docker-compose up -d --scale lms-app=3
   ```

### Docker Swarm

1. **Initialize swarm:**
   ```bash
   docker swarm init
   ```

2. **Deploy stack:**
   ```bash
   docker stack deploy -c docker-compose.yml lms
   ```

## ☁️ Cloud Providers

### AWS

#### Elastic Container Service (ECS)

1. **Push image to ECR:**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com
   docker tag lms-app:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/lms-app:latest
   docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/lms-app:latest
   ```

2. **Create ECS task definition and service**

#### Elastic Beanstalk

1. **Create Dockerrun.aws.json:**
   ```json
   {
     "AWSEBDockerrunVersion": "1",
     "Image": {
       "Name": "your-dockerhub-username/lms-app:latest",
       "Update": "true"
     },
     "Ports": [
       {
         "ContainerPort": "3000"
       }
     ]
   }
   ```

2. **Deploy using EB CLI:**
   ```bash
   eb init
   eb create
   eb deploy
   ```

### Google Cloud Platform

#### Cloud Run

1. **Build and push to Container Registry:**
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/lms-app
   ```

2. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy --image gcr.io/YOUR_PROJECT_ID/lms-app --platform managed
   ```

#### Google Kubernetes Engine (GKE)

1. **Create deployment.yaml:**
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: lms-app
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: lms-app
     template:
       metadata:
         labels:
           app: lms-app
       spec:
         containers:
         - name: lms-app
           image: gcr.io/YOUR_PROJECT_ID/lms-app:latest
           ports:
           - containerPort: 3000
           env:
           - name: NODE_ENV
             value: "production"
           # Add other environment variables
   ```

2. **Apply configuration:**
   ```bash
   kubectl apply -f deployment.yaml
   ```

### Azure

#### Container Instances

```bash
az container create \
  --resource-group myResourceGroup \
  --name lms-app \
  --image your-dockerhub-username/lms-app:latest \
  --ports 3000 \
  --environment-variables NODE_ENV=production
```

#### App Service

```bash
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name lms-app \
  --deployment-container-image-name your-dockerhub-username/lms-app:latest
```

## 🔧 Environment Configuration

### Required Environment Variables

- `NODE_ENV=production`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Optional Environment Variables

- `NEXT_PUBLIC_VAPI_WEB_TOKEN` (for AI voice features)
- `SENTRY_AUTH_TOKEN` (for error tracking)

## 📊 Monitoring & Logging

### Health Check Endpoint

The application exposes a health check at `/api/health`:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'healthy', timestamp: new Date().toISOString() })
}
```

### Monitoring Setup

1. **Add health check to your monitoring service**
2. **Configure alerts for:**
   - Application availability
   - Response times
   - Error rates
   - Resource utilization

### Logging

- Application logs are output to `stdout`
- Use centralized logging solutions:
  - AWS CloudWatch
  - Google Cloud Logging
  - Azure Monitor
  - ELK Stack
  - Datadog

## 🔐 Security Considerations

### SSL/TLS

- Always use HTTPS in production
- Configure SSL certificates (Let's Encrypt, CloudFlare, etc.)
- Enable HSTS headers

### Environment Security

- Never commit `.env` files to version control
- Use secret management services:
  - AWS Secrets Manager
  - Azure Key Vault
  - Google Secret Manager
  - HashiCorp Vault

### Network Security

- Configure firewalls appropriately
- Use VPC/VNet for cloud deployments
- Implement rate limiting
- Configure CORS properly

## 📈 Performance Optimization

### CDN Setup

- Use CDN for static assets
- Configure proper cache headers
- Enable gzip compression

### Database Optimization

- Use connection pooling
- Configure read replicas if needed
- Implement caching strategies (Redis, Memcached)

### Application Monitoring

- Set up APM tools (New Relic, Datadog, AppSignal)
- Monitor key metrics:
  - Response times
  - Throughput
  - Error rates
  - Database performance

## 🔄 CI/CD Pipeline

The included GitHub Actions workflow provides:

- **Automated testing**
- **Security scanning**
- **Docker builds**
- **Deployment automation**
- **Notifications**

### Required Secrets

Configure these secrets in your GitHub repository:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_VAPI_WEB_TOKEN`
- `SENTRY_AUTH_TOKEN`
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `CODECOV_TOKEN` (optional)
- `SNYK_TOKEN` (optional)
- `SLACK_WEBHOOK` (optional)

## 🚨 Troubleshooting

### Common Issues

1. **Build failures:**
   - Check environment variables
   - Verify dependencies
   - Review build logs

2. **Runtime errors:**
   - Check application logs
   - Verify database connectivity
   - Confirm external service availability

3. **Performance issues:**
   - Monitor resource usage
   - Check database queries
   - Review CDN configuration

### Support

- Check the application logs first
- Review the health check endpoint
- Monitor external service status
- Contact support with specific error messages and logs