import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function SimpleCard({info}) {
  const classes = useStyles();
  const{rowid,edgeID,startDist,endDist,isBlue} = info

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="body2" component="p">
          rowid:{rowid}
          <br />
          edgeID:{edgeID}
          <br />
          startDist:{startDist}
          <br />
          endDist:{endDist}
          <br />
          isBlue:{isBlue}
        </Typography>
      </CardContent>
    </Card>
  );
}
