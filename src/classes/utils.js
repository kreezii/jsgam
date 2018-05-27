import * as PolyK from 'polyk';

function boxesIntersect(a, b)
{
  var ab = a.getBounds();
  var bb = b.getBounds();
  return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

function collision(polygon,x,y)
{
  return PolyK.ContainsPoint(polygon,x,y);
}
/*
function checkPath(newpos,polygons,walkPoly){
  let checkPoint=false;
  let changePosition=null;
  if(polygons==undefined){polygons=[];}
  for(let i=0;i<polygons.length && !checkPoint ;i++){
    checkPoint=PolyK.ContainsPoint(polygons[i],newpos.x,newpos.y);
  }
  if(checkPoint){
    changePosition=PolyK.ClosestEdge(walkPoly,newpos.x,newpos.y).point;
    var newPos={x:Math.round(changePosition.x)-10,y:Math.round(changePosition.y)+10}
  }

  return newPos;
}
*/

function checkPath(newpos,obstaclesPolys,walkPoly){
  let changePosition;
  let checkPoint;
  let newPos;

  if(!PolyK.ContainsPoint(walkPoly,newpos.x,newpos.y))
  {
    changePosition=PolyK.ClosestEdge(walkPoly,newpos.x,newpos.y).point;
    newPos={x:Math.round(changePosition.x),y:Math.round(changePosition.y)+10}
    //  while(walkPoly.indexOf(newPos.x)){ console.log(newPos.x);newPos.x+=1;}

  }/*else if(obstaclesPolys!=undefined){
    for(let i=0;i<obstaclesPolys.length && !checkPoint ;i++){
      checkPoint=PolyK.ContainsPoint(obstaclesPolys[i],newpos.x,newpos.y);
      changePosition=PolyK.ClosestEdge(walkPoly,newpos.x,newpos.y).point;
      break;
    }
  }*/

  return newPos;
}

export {boxesIntersect,checkPath,collision};
