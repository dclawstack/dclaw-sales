# Troubleshooting

Common issues and solutions for DClaw Sales.

## Quick Diagnostics

```bash
# Check app pods
kubectl get pods -n dclaw-sales

# Check logs
kubectl logs -n dclaw-sales deployment/dclaw-sales-backend

# Check database
kubectl get clusters -n dclaw-sales
```

## Sections

- [Common Issues](./common-issues)
- [FAQ](./faq)
