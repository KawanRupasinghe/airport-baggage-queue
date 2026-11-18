"""Single FIFO queue with parallel identical inspection stations; units: minutes."""
from collections import deque
from dataclasses import dataclass
from math import inf
import random

@dataclass
class Result:
    arrivals: int
    completed: int
    mean_wait: float
    fraction_wait_over_target: float
    mean_queue_length: float
    utilisation: float
    waits: list

def simulate(arrivals, services, servers=2, target_wait=5.0):
    """Deterministic event-trace engine; arrivals and services are equal-length sequences."""
    if servers < 1 or len(arrivals) != len(services):
        raise ValueError("Invalid server count or trace lengths")
    if any(b < a for a,b in zip(arrivals,arrivals[1:])):
        raise ValueError("Arrivals must be sorted")
    if any(s <= 0 for s in services):
        raise ValueError("Service durations must be positive")
    n=len(arrivals)
    if not n:
        return Result(0,0,0,0,0,0,[])
    idle=list(range(servers))
    finish=[inf]*servers
    queue=deque()
    waits=[0.0]*n
    i=0; done=0; now=0.; queue_area=0.; busy_area=0.
    horizon_start=arrivals[0]
    while done<n:
        next_arrival=arrivals[i] if i<n else inf
        next_depart=min(finish)
        t=min(next_arrival,next_depart)
        queue_area+=len(queue)*(t-now)
        busy_area+=sum(f<inf for f in finish)*(t-now)
        now=t
        # Departures before arrivals at tied timestamps.
        departing=[j for j,f in enumerate(finish) if f==now]
        for j in departing:
            finish[j]=inf; done+=1; idle.append(j)
        while i<n and arrivals[i]==now:
            queue.append(i); i+=1
        idle.sort()
        while idle and queue:
            j=idle.pop(0)
            customer=queue.popleft()
            waits[customer]=now-arrivals[customer]
            finish[j]=now+services[customer]
    duration=now-horizon_start
    return Result(n,done,sum(waits)/n,sum(w>target_wait for w in waits)/n,
                  queue_area/duration if duration else 0,
                  busy_area/(servers*duration) if duration else 0,waits)

def random_trace(rate_per_minute, mean_service_minutes, n, seed):
    if rate_per_minute<=0 or mean_service_minutes<=0: raise ValueError("Rates must be positive")
    rng=random.Random(seed); t=0.; arrivals=[]; services=[]
    for _ in range(n):
        t+=rng.expovariate(rate_per_minute)
        arrivals.append(t)
        services.append(rng.expovariate(1/mean_service_minutes))
    return arrivals,services

if __name__=="__main__":
    a,s=random_trace(0.8,1,1000,42)
    r=simulate(a,s,2)
    assert r.completed==r.arrivals==1000
    assert all(w>=0 for w in r.waits)
    print(r)
