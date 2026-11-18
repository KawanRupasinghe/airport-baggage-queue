import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"src"))
from queue_model import simulate,random_trace

def test_hand_trace():
    r=simulate([0,1,1.5],[3,2,1],servers=1)
    assert r.completed==3
    assert r.waits==[0,2,3.5]
    assert abs(r.mean_wait-((0+2+3.5)/3))<1e-12

def test_zero_wait_with_separated_arrivals():
    r=simulate([0,10,20],[1,1,1],servers=1)
    assert r.mean_wait==0

def test_reproducible():
    assert random_trace(.5,1,20,7)==random_trace(.5,1,20,7)
