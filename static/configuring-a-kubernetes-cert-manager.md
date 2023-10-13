# Configuring a Kubernetes Cert Manager

## The Cert Manager

Next up is installing and configuring cert manager to manage all issuing/expiration of certificates via the CA ( Certificate Authority ) of our choosing. I've already spent most of a day trying ( and failing ) to get it properly configured, but alas, there is no growth without failure.

* Cert Manager Docs
* Helm Repo

At the time of writing this the latest version of Jetstack/Cert-Manager is `1.10.0` so we will use that for our installation.

The instructions in the Helm Repo state that CustomResourceDefinitions (CRDs for short) are highly recommended prior to installing the cert-manager. This separate step allows that ability to easily uninstall/reinstall cert-manager without deleting any existing custom resources.

Installing CustomResourceDefinitions (CRD)

```sh
$ kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.10.0/cert-manager.crds.yaml
>>
customresourcedefinition.apiextensions.k8s.io/clusterissuers.cert-manager.io created
customresourcedefinition.apiextensions.k8s.io/challenges.acme.cert-manager.io created
customresourcedefinition.apiextensions.k8s.io/certificaterequests.cert-manager.io created
customresourcedefinition.apiextensions.k8s.io/issuers.cert-manager.io created
customresourcedefinition.apiextensions.k8s.io/orders.acme.cert-manager.io created
```
After CRDs have been applied we can add Jetstack/Cert-Manager to our helm repo list

```sh
$ helm repo add jetstack https://charts.jetstack.io
```
Install the cert-manager under it's own release and namespace using Helm

```sh
$ helm install app-cert --namespace cert-manager --create-namespace --version v1.10.0 jetstack/cert-manager
>>
NAME: app-cert
LAST DEPLOYED: Mon Oct 17 12:04:33 2022
NAMESPACE: cert-manager
STATUS: deployed
REVISION: 1
TEST SUITE: None
cert-manager v1.10.0 has been deployed successfully!
```

Now that the certificate manager is installed in it&#39;s own namespace, and on it&#39;s own release we can easily manage it.<br>The next step is to provision an `Issuer` resource so we can begin issuing certificates to our services! The primary reason I&#39;m using an `Issuer` resource as opposed to a <em>ClusterIssuer</em> is that this fairly simple architecture only uses one namespace (`default`) for the applications that need to be secured. If I had multiple applications in different namespaces I would would <em>ClusterIssuer</em> which is namespace-agnostic.

The issuer will look like this:

```sh
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt-app-prod
  namespace: default
spec:
  acme:
    # The ACME server URL
    server: https://acme-v02.api.letsencrypt.org/directory
    # Email address used for ACME registration
    email: myEmail
    # Name of a secret used to store the ACME account private key
    privateKeySecretRef:
      name: someSecretString
    # Enable the HTTP-01 challenge provider
    solvers:
    - http01:
        ingress:
          class: nginx       
```

I&#39;m using the production letsencrypt endpoint here because this domain will continue to be used and locked to this application for the foreseeable future.

Once everything is properly configured in our `staging_issuer.yaml` file we can apply it using <em>kubectl</em>

```sh
$ kubectl apply -f staging_issuer.yaml
issuer.cert-manager.io/letsencrypt-beehive-prod created
```

We should now have an active <em>Issuer</em> resource! However, we&#39;re not done just yet. We&#39;ll need to re-configure each services Ingress to specify some annotations and enable TLS.

To keep this short I&#39;ll provide the resource re-configuration here:
```yaml
ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: nginx
    # Here we added the annotations to enable TLS-Acme, and specified the cert managing Issuer we&#39;ll hook onto
    kubernetes.io/tls-acme: "true"
    cert-manager.io/issuer: letsencrypt-app-prod
  hosts:
    - host: app.mysite.com
      paths:
        - path: /{servicePath}
          pathType: Prefix
          backend:
            service:
              name: #{serviceName}
              port:
               number: 80
  # Here&#39;s the TLS stanza that we&#39;ve added. Note the host name to be secured, as well as a TLS-Secret
  # that is relative to the individual service we&#39;re updating.
  tls:
  - hosts:
    - app.mysite.com
    secretName: #{serviceName}-tls
```   
After that&#39;s all set we can apply the configuration changes using Helm

```sh
$ helm upgrade beehive ./Charts/beehive
```
This is where the issues start..
## Issues

1. On initial observation the SSL Cert was applied, however it was being denied by browser due to error "<strong><em>Kubernetes Issued Fake Certificate</em></strong>"<br><br>To locate the source of the issue I made a deep-dive into troubleshooting via `Kubectl`. Using `kubectl describe` I can find logs on individual reason why the certificates were not being correctly provisioned.
```sh
$ kubectl describe certificates
>>
NAME             READY   SECRET           AGE
characters-tls   False   characters-tls   3m6s
media-tls        False   media-tls        3m6s
players-tls      False   players-tls      3m5s
quests-tls       False   quests-tls       3m5s
store-tls        False   store-tls        3m5s</pre><p><br>Well <em>shit</em>.. Let&#39;s take a look at a single certificate.</p><pre>$ kubectl describe certificate characters-tls
>>
............
Status:
  Conditions:
    Last Transition Time:        2022-10-17T16:58:41Z
    Message:                     Issuing certificate as Secret does not exist
    Observed Generation:         1
    Reason:                      DoesNotExist
    Status:                      False
    Type:                        Ready
    Last Transition Time:        2022-10-17T16:58:41Z
    Message:                     Issuing certificate as Secret does not exist
    Observed Generation:         1
    Reason:                      DoesNotExist
    Status:                      True
    Type:                        Issuing
  Next Private Key Secret Name:  characters-tls-6x2nk
Events:
  Type    Reason     Age    From                                       Message
  ----    ------     ----   ----                                       -------
  Normal  Issuing    3m29s  cert-manager-certificates-trigger          Issuing certificate as Secret does not exist
  Normal  Generated  3m28s  cert-manager-certificates-key-manager      Stored new private key in temporary Secret resource "characters-tls-6x2nk"
  Normal  Requested  3m28s  cert-manager-certificates-request-manager  Created new CertificateRequest resource "characters-tls-z72fs"
```  

OK so the certificate doesn&#39;t exist and is having issues provisioning. Going down the troubleshooting list for ACME/LetsEncrypt found [here](https://cert-manager.io/docs/troubleshooting/acme/) it says we should check to make sure that the `<em>http01</em>` challenge is working correctly. Let&#39;s check it out
```sh
$ kubectl get challenges
>>
NAME                                         STATE     DOMAIN               AGE
characters-tls-z72fs-3765316351-1478577462   pending   app.mysite.com   6m32s
media-tls-2df7m-3765316351-1478577462                  app.mysite.com   6m32s
players-tls-hcn4f-3765316351-1478577462                app.mysite.com   6m32s
quests-tls-t6xvj-3765316351-1478577462                 app.mysite.com   6m32s
store-tls-gwmx6-3765316351-1478577462                  app.mysite.com   6m31s
```
Hmm that&#39;s strange, why is the challenge not completing. Let&#39;s find out.

```sh
$ kubectl describe challenge characters-tls-z72fs-3765316351-1478577462
>>
....
Status:
  Presented:   true
  Processing:  true
  Reason:      Waiting for HTTP-01 challenge propagation: failed to perform self check GET request &#39;http://app.mysite/acme-challenge/Gy5Fk4oxKTXYM3gIXdl2P1IwBSeoc66c5I4CE42ScwQ": EOF
  State:       pending
Events:
  Type    Reason     Age    From                     Message
  ----    ------     ----   ----                     -------
  Normal  Started    7m14s  cert-manager-challenges  Challenge scheduled for processing
  Normal  Presented  7m14s  cert-manager-challenges  Presented challenge using HTTP-01 challenge mechanism
```
  
Interesting. The challenge is failing from a simple HTTP-01 request. My thought&#39;s are is if we can fix the Challenge we fix the certificate provisioning.

## Solution

*Luckily* after only a few minutes of ninja-level google searching I came across this <a href="https://stackoverflow.com/a/65879795" rel="noopener noreferrer" target="_blank">answer</a> in StackOverflow.

Let&#39;s break down what this solution would do to our infrastructure. When making a Challenge, the LoadBalancer want&#39;s to test the internal services using the `http01` method. That&#39;s great.. except the internal services are configured to only be recognized by their internal IP addresses. If we change the annotation on our LoadBalancer to specify an internal host name to use, this could potentially solve our issue.<br><br>Let&#39;s add the annotation to our LoadBalancer config <em>staging_load.yaml</em>.
```sh
apiVersion: v1
kind: Service
metadata:
  annotations:
    service.beta.kubernetes.io/do-loadbalancer-enable-proxy-protocol: "true"
    service.beta.kubernetes.io/do-loadbalancer-hostname: "app.mysite.com" # We&#39;re adding our Hostname as an annotation here
    service.beta.kubernetes.io/do-loadbalancer-name: "ingress-nginx-load-balancer"
    service.beta.kubernetes.io/do-loadbalancer-protocol: "http"
    service.beta.kubernetes.io/do-loadbalancer-tls-ports: "443"
    service.beta.kubernetes.io/do-loadbalancer-tls-passthrough: "true"
    service.beta.kubernetes.io/do-loadbalancer-http-ports: "80"
    service.beta.kubernetes.io/do-loadbalancer-algorithm: "least_connections"
  labels:
    app.kubernetes.io/component: controller
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
    app.kubernetes.io/version: 1.4.0
  name: ingress-nginx-controller
  namespace: ingress-nginx</pre><p><br>Re-applying the configuration..</p><pre>
$ kubectl apply -f staging_load.yaml
>>
serviceaccount/ingress-nginx unchanged
serviceaccount/ingress-nginx-admission unchanged
role.rbac.authorization.k8s.io/ingress-nginx unchanged
role.rbac.authorization.k8s.io/ingress-nginx-admission unchanged
clusterrole.rbac.authorization.k8s.io/ingress-nginx unchanged
clusterrole.rbac.authorization.k8s.io/ingress-nginx-admission unchanged
rolebinding.rbac.authorization.k8s.io/ingress-nginx unchanged
rolebinding.rbac.authorization.k8s.io/ingress-nginx-admission unchanged
clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx unchanged
clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx-admission unchanged
configmap/ingress-nginx-controller unchanged
service/ingress-nginx-controller configured
service/ingress-nginx-controller-admission unchanged
deployment.apps/ingress-nginx-controller configured
job.batch/ingress-nginx-admission-create unchanged
job.batch/ingress-nginx-admission-patch unchanged
ingressclass.networking.k8s.io/nginx unchanged
validatingwebhookconfiguration.admissionregistration.k8s.io/ingress-nginx-admission configured
```
After checking the output via Browser, and PostMan I can confirm.. we have successfully provisioned our SSL!