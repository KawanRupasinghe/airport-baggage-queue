import sys,json,subprocess
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"src"))
from queue_model import simulate

def test_python_javascript_same_fixed_traces():
    cases=[
      dict(arrivals=[0,1,1.5],services=[3,2,1],servers=1),
      dict(arrivals=[5,6,6.5],services=[3,2,1],servers=1),
      dict(arrivals=[2,2,2,3.2,8],services=[1,4,2,1.5,2],servers=2),
      dict(arrivals=[0,10,20],services=[1,1,1],servers=1),
      dict(arrivals=[0.2,0.4,0.41,0.43,0.5],services=[1,2,3,.3,4],servers=3),
    ]
    runner=Path(__file__).with_name('cross_language_bridge.js')
    cp=subprocess.run(['node',str(runner)],input=json.dumps(cases),text=True,capture_output=True,check=True)
    browser=json.loads(cp.stdout)
    for x,b in zip(cases,browser):
        py=simulate(x['arrivals'],x['services'],servers=x['servers'])
        assert py.arrivals==b['arrivals'] and py.completed==b['completed']
        for key in ['mean_wait','mean_queue_length','utilisation']:
            assert abs(getattr(py,key)-b[key])<1e-10,(x,key,getattr(py,key),b[key])
        for a,z in zip(py.waits,b['waits']):
            assert abs(a-z)<1e-10
