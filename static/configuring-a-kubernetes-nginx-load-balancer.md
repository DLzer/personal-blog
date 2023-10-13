# Configuring a Kubernetes NGINX Load Balancer

## Load Balancer

To ease the pain of manually writing all of the service mapping configurations for an Ingress-NGINX load balancer, I found that it could be easily deployed with a command that pulls directly from the Kubernetes/Ingress-NGINX repo. This command runs a
<em>deploy.yaml</em> file that is specific to Digital Ocean ( or any other provider ).
```sh
$ kubectl apply -f "https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.4.0/deploy/static/provider/do/deploy.yaml"
```

However, As noted in the [documentation](https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean) for the specific Digital Ocean installation there are missing annotations that will help further auxiliary processes to function properly. Without them we lose some abilities in DO:
- Naming conventions for Digital Ocean UI
- Opening ports for HTTP throughput graphing
- Enabling ports for TLS traffic
- Enabling the ability to proxy certain traffic

To mitigate this, I downloaded the `deploy.yaml` file directly into the `/Charts` directory under the file name `staging_load.yaml` and added the annotations manually. The specific annotations to be used can be in this [GitHub Issue](https://github.com/kubernetes/ingress-nginx/issues/8965). I omitted the <em>service.beta.kubernetes.io/do-loadbalancer-hostname</em> annotation because it broke internal proxying for endpoints. Everything else worked perfectly. In short, the annotations I added:
```sh$ kubectl apply -f ./Charts/beehive/staging_load.yaml```

You should get an output similar to:

```sh
namespace/ingress-nginx created
serviceaccount/ingress-nginx created
role.rbac.authorization.k8s.io/ingress-nginx created
clusterrole.rbac.authorization.k8s.io/ingress-nginx created
clusterrole.rbac.authorization.k8s.io/ingress-nginx-admission created
rolebinding.rbac.authorization.k8s.io/ingress-nginx created
rolebinding.rbac.authorization.k8s.io/ingress-nginx-admission created
clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx created
clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx-admission created
service/ingress-nginx-controller created
service/ingress-nginx-controller-admission created
deployment.apps/ingress-nginx-controller created
job.batch/ingress-nginx-admission-create created
job.batch/ingress-nginx-admission-patch created
ingressclass.networking.k8s.io/nginx created
```

After the Load Balancer finished installation I ran the following command to get the assigned `External IP`. This was saved and used to point the DNS A Record to the Load Balancer.

```sh
$ kubectl --namespace ingress-nginx get services -o wide

NAME                                 TYPE           CLUSTER-IP      EXTERNAL-IP               PORT(S)                      AGE   SELECTOR
ingress-nginx-controller             LoadBalancer   10.245.185.32   <your-ip-here>   80:31259/TCP,443:31757/TCP            12m   app.kubernetes.io/component=controller,app.kubernetes.io/instance=ingress-nginx,app.kubernetes.io/name=ingress-nginx
ingress-nginx-controller-admission   ClusterIP      10.245.69.146   <none>  
```

