import React, {useState, useEffect} from 'react';

const Displayprizes = () => {

    const [prizes, setPrizes] = useState([]);
    const [filteredPrizes, setFilteredPrizes] = useState([]);
    const [categories,setCategories] = useState([]);
    const [years,setYears] = useState([]);
    const [selectedCat, setSelectedCat] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
		const [mostWonPeople, setMostWonpeople] = useState({});


    useEffect(() => {
        fetch("http://api.nobelprize.org/v1/prize.json")
        .then(res => res.json())
        .then((data) => {

					let allcategories = [];
					let allYears = [];
					let userPrizeCount = {};
					let mostWonUserData = {}

            data.prizes.forEach((prize) => {
							const {category, year, laureates} = prize;

							if(allcategories.includes(category) == false){
								allcategories.push(category)
							};

							if(allYears.includes(year) == false){
								allYears.push(year)
							};

							if(laureates){
								laureates.map(({ id}) => {
									if(userPrizeCount[id]){
										userPrizeCount[id].push(prize)
									} else {
										userPrizeCount[id] = [prize]
									}
								})
							}
						});

						Object.keys(userPrizeCount).forEach((id) => {
							if(userPrizeCount[id].length>1){
								mostWonUserData[id] = userPrizeCount[id]	
							}
						})

						console.log(mostWonUserData);
            setCategories(allcategories)
						setYears(allYears);
						setPrizes(data.prizes)
						setMostWonpeople(mostWonUserData	)
        })

    }, [])

    useEffect(() => {

			if(!!selectedCat == false && !!selectedYear == false) {
				setFilteredPrizes([])
			} else {
				const filtered = prizes.filter(({category, year}) => {
					if(selectedCat && category != selectedCat) return false;
					if(selectedYear && year != selectedYear) return false;

					return true;
				});
				setFilteredPrizes(filtered)
			} 

    }, [selectedCat, selectedYear])


		const results = selectedCat ? filteredPrizes : prizes;
		const mostOwnedIds = Object.keys(mostWonPeople);

    return (
        <div style={{maxWidth: 500, margin: '0 auto'}}>
				<div style={{height: 300, marginBottom: 20, overflow: 'scroll'}}>
					<h5>Most Nobel prize woned people</h5>
					<table class="table table-bordered">
                <thead class="thead-dark">
                    <th>#</th>
                    <th>name</th>
                    <th>Year</th>
                    <th>Category</th>
                    <th>Actions</th>
                </thead>
                <tbody>
                    {
                        mostOwnedIds.map((id, index) => {
													const data = mostWonPeople[id];
													const author = data[0].laureates.find(({id: idx}) => idx==id);
													const name = `${author.firstname}`;

                          return data.map((prize, pIndex) => {
														return (
															<tr>
																<td>{index}</td>
																<td>{name}</td>
																<td>{prize.year}</td>
																<td>{prize.category}</td>
																<td>#</td>
															</tr>
														)
													})
                        })
                    }
                </tbody>
                
            </table>
				</div>
					<div style={{marginBottom: 20, marginTop: 20}}>
            <label>Choose Category &nbsp;</label>
						<select value={selectedCat} onChange={(e) => { setSelectedCat(e.target.value) }}>
							<option value=''>Select</option>
							{
								categories.map((category,index)=>{
									return (
										<option value={category}>{category}</option>
									)
								})	
							}
						</select>
						<select value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value) }}>
							<option value=''>Select</option>
							{
								years.map((year,index)=>{
									return (
										<option value={year}>{year}</option>
									)
								})	
							}
						</select>
						<button
							className='btn btn-secondary'
							onClick={() => {
								setSelectedCat('')
								setSelectedYear('')
							}}
							style={{marginLeft: 20}}
						>Clear</button>
					</div>
            
            <table class="table table-bordered">
                <thead class="thead-dark">
                    <th>#</th>
                    <th>Year</th>
                    <th>Category</th>
                    <th>Winners</th>
                    <th>Actions</th>
                </thead>
                <tbody>
                    {
                        results.map((prize, index) => {
                            return (
                                <tr>
                                    <td>{index+1}</td>
                                    <td>{prize.year}</td>
                                    <td>{prize.category}</td>
                                    <td>
                                        {
                                            prize.laureates && prize.laureates .map((val,index)=>{
                                                return(
                                                    <div>
                                                    <h6>{val.firstname}</h6>
                                                    </div>
                                                )
                                            })
                                        }
                                    </td>
                                    <td>Actions</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
                
            </table>
        </div>
    )
}
export default Displayprizes;